"""create blocklist table

Revision ID: c89b3c79ca56
Revises: d927804cf963
Create Date: 2025-01-26 12:08:24.861672

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c89b3c79ca56'
down_revision = 'd927804cf963'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tokenlocklist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('tokenlocklist', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_tokenlocklist_jti'), ['jti'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tokenlocklist', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_tokenlocklist_jti'))

    op.drop_table('tokenlocklist')
    # ### end Alembic commands ###
